import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { JsonRpcProvider, Contract, Wallet, formatEther, parseEther, ContractFactory } from 'ethers';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = multer();
const Property = await import('./models/Property.js').then(m => m.default || m);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));

// Load ABI/Bytecode from Hardhat
const artifact = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../rentchain-hardhat2/artifacts/contracts/RentalAgreement.sol/RentalAgreement.json'),
    'utf8'
  )
);

const abi = artifact.abi;
const bytecode = artifact.bytecode;
const provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// --- NEW: Image Upload to Cloudinary --- //
app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) throw new Error('No image file received');
    cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ imageUrl: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Property Listing APIs ----

app.post('/property', async (req, res) => {
  try {
    const { title, description, ipfsHash, owner, contractAddress, rentEth, depositEth, duration, imageUrl } = req.body;
    const property = new Property({ title, description, ipfsHash, owner, contractAddress, rentEth, depositEth, duration, imageUrl, status: 'available' });
    await property.save();
    res.json({ success: true, property });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
});

app.get('/properties', async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
});

app.get('/property/:id', async (req, res) => {
  const property = await Property.findById(req.params.id);
  res.json(property);
});

app.get('/properties/by-owner/:owner', async (req, res) => {
  const properties = await Property.find({ owner: req.params.owner });
  res.json(properties);
});

// ---- Rental Agreement APIs ----

app.post('/deploy', async (req, res) => {
  try {
    const { renter, ipfsHash, rentEth, depositEth, duration } = req.body;
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    const factory = new ContractFactory(abi, bytecode, wallet);

    const deployed = await factory.deploy(
      renter,
      ipfsHash,
      parseEther(rentEth),
      parseEther(depositEth),
      duration
    );
    await deployed.waitForDeployment();

    res.json({ address: deployed.target || deployed.address });
  } catch (err) {
    console.error("Deploy error:", err);
    res.status(400).json({ error: err.toString() });
  }
});

app.get('/status/:address', async (req, res) => {
  try {
    const dynamicContract = new Contract(req.params.address, abi, provider);
    const isActive = await dynamicContract.isActive();
    const isTerminated = await dynamicContract.isTerminated();
    res.json({ isActive, isTerminated });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
});

app.get('/agreement/:address', async (req, res) => {
  try {
    const dynamicContract = new Contract(req.params.address, abi, provider);
    const [
      landlord, renter, propertyIPFSHash, rentAmount,
      depositAmount, rentalDuration, isActive, isTerminated
    ] = await Promise.all([
      dynamicContract.landlord(),
      dynamicContract.renter(),
      dynamicContract.propertyIPFSHash(),
      dynamicContract.rentAmount(),
      dynamicContract.depositAmount(),
      dynamicContract.rentalDuration(),
      dynamicContract.isActive(),
      dynamicContract.isTerminated()
    ]);
    res.json({
      landlord,
      renter,
      propertyIPFSHash,
      rentAmount: formatEther(rentAmount),
      depositAmount: formatEther(depositAmount),
      rentalDuration: rentalDuration.toString(),
      isActive,
      isTerminated
    });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
});

// Activate contract
app.post('/activate', async (req, res) => {
  try {
    const { contractAddress, rentEth, depositEth } = req.body;
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithSigner = new Contract(contractAddress, abi, wallet);
    const value = parseEther((Number(rentEth) + Number(depositEth)).toString());
    const tx = await contractWithSigner.activateAgreement({ value });
    await tx.wait();
    await Property.updateOne({ contractAddress }, { $set: { status: 'occupied' } });
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(400).json({ success: false, error: err.toString() });
  }
});

// Terminate contract
app.post('/terminate', async (req, res) => {
  try {
    const { contractAddress } = req.body;
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithSigner = new Contract(contractAddress, abi, wallet);
    const tx = await contractWithSigner.terminateAgreement();
    await tx.wait();
    await Property.updateOne({ contractAddress }, { $set: { status: 'terminated' } });
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(400).json({ success: false, error: err.toString() });
  }
});

// Start server
if (process.env.NODE_ENV !== 'production') {
   app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

export default app;
