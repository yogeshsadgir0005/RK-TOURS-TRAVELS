import { Route } from '../models/Route.js';

export const createRoute = async (req, res, next) => {
  try {
    const { pickupStreet, pickupCity, destinationStreet, destinationCity, distance, basePrice } = req.body;
    const routeExists = await Route.findOne({ pickupCity, destinationCity, pickupStreet, destinationStreet });
    if (routeExists) return res.status(400).json({ message: 'Route already exists' });

    const route = await Route.create({ pickupStreet, pickupCity, destinationStreet, destinationCity, distance, basePrice });
    res.status(201).json(route);
  } catch (error) { next(error); }
};

export const getAllRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find({}).sort('pickupCity');
    res.json(routes);
  } catch (error) { next(error); }
};

export const getRouteById = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (error) { next(error); }
};

export const updateRoute = async (req, res, next) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (error) { next(error); }
};

export const deleteRoute = async (req, res, next) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json({ message: 'Route deleted successfully' });
  } catch (error) { next(error); }
};