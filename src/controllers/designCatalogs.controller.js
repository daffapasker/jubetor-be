import * as catalogService from "../services/designCatalogs.service.js";

export const createCatalog = async (req, res, next) => {
  try {
    const catalog = await catalogService.createDesignCatalog(req.body, req.file);
    res.status(201).json(catalog);
  } catch (error) {
    next(error);
  }
};

export const getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await catalogService.getDesignCatalogs();
    res.json(catalogs);
  } catch (error) {
    next(error);
  }
};

export const getCatalogById = async (req, res, next) => {
  try {
    const catalog = await catalogService.getDesignCatalogById(req.params.id);
    res.json(catalog);
  } catch (error) {
    next(error);
  }
};

export const updateCatalog = async (req, res, next) => {
  try {
    const updated = await catalogService.updateDesignCatalog(req.params.id, req.body, req.file);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteCatalog = async (req, res, next) => {
  try {
    const result = await catalogService.deleteDesignCatalog(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};