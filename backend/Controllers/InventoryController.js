import Inventory from '../models/Inventory.js'
import { VerifyUser } from '../Utils/VerifyToken.js';

export const createInventory = async (req, res) => {
    console.log(req.body);
    const newInventory = new Inventory(req.body);
    try {
      const savedInventory = await newInventory.save();
      res.status(201).json({
        success: true,
        message: "Successfully created",
        data: savedInventory,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

// Update a Inventory
export const updateInventory = async (req, res) => {
  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedInventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.json(updatedInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Inventory
export const deleteInventory = async (req, res) => {
  try {
    const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedInventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.json({ message: 'Inventory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a single Inventory
export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read all inventorys
export const getAllInventorys = async (req, res) => {
  try {
    const inventorys = await Inventory.find();
    res.json(inventorys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
