import * as trackService from "../services/trackRecords.service.js";

export const createTrackRecord = async (req, res, next) => {
  try {
    const record = await trackService.createTrackRecord(req.body, req.files);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const getTrackRecords = async (req, res, next) => {
  try {
    const records = await trackService.getTrackRecords();
    res.json(records);
  } catch (error) {
    next(error);
  }
};

export const getTrackRecordById = async (req, res, next) => {
  try {
    const record = await trackService.getTrackRecordById(req.params.id);
    res.json(record);
  } catch (error) {
    next(error);
  }
};

export const updateTrackRecord = async (req, res, next) => {
  try {
    const updated = await trackService.updateTrackRecord(req.params.id, req.body, req.files);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTrackRecord = async (req, res, next) => {
  try {
    const result = await trackService.deleteTrackRecord(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};