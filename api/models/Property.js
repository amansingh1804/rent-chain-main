import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: String,
  description: String,
  ipfsHash: String,
  owner: String,
  contractAddress: String,
  rentEth: String,
  depositEth: String,
  duration: String,
  status: String,
  imageUrl: String    // <-- Add this field!
});

const Property = mongoose.model('Property', PropertySchema);
export default Property;
