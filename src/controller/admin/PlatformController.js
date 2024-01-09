import { StatusCodes } from "http-status-codes";
import { ResponseMessage } from "../../utils/ResponseMessage.js";
import { Platform } from "../../model/Platform.js";
export const addEditPlatform = async (req, res) => {
  try {
    if (req.body.id) {
      const checkPlatform = await Platform.find({
        _id: { $ne: req.body.id },
        name: req.body.name,
        isDeleted: false,
      });
      if (checkPlatform.length) {
        return res.status(409).json({
          status: StatusCodes.CONFLICT,
          message: ResponseMessage.PLATFORM_ALREADY_CREATED,
          data: [],
        });
      }
      const updatePlatform = await Platform.findByIdAndUpdate(req.body.id, req.body, {new: true});
      if (updatePlatform) {
        return res.status(200).json({
          status: StatusCodes.OK,
          message: ResponseMessage.PLATFORM_UPDATED,
          data: updatePlatform,
        });
      } else {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.PLATFORM_NOT_UPDATED,
          data: [],
        });
      }
    } else {
      const checkPlatform = await Platform.find({
        name: req.body.name,
        isDeleted: false,
      });
      if (checkPlatform.length) {
        return res.status(409).json({
          status: StatusCodes.CONFLICT,
          message: ResponseMessage.PLATFORM_ALREADY_CREATED,
          data: [],
        });
      }
      const savePlatform = await Platform.create(req.body);
      if (savePlatform) {
        return res.status(201).json({
          status: StatusCodes.CREATED,
          message: ResponseMessage.PLATFORM_CREATED,
          data: savePlatform,
        });
      } else {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.PLATFORM_NOT_CREATED,
          data: [],
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: [error.message],
    });
  }
};

export const getPlatform = async (req, res) => {
  try {
    const findPlatform = await Platform.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    if (findPlatform) {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: ResponseMessage.PLATFORM_FETCHED,
        data: findPlatform,
      });
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.PLATFORM_NOT_FOUND,
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: [error.message],
    });
  }
};

export const deletePlatform = async (req, res) => {
  try {
    const platformDelete = await Platform.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (platformDelete) {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: ResponseMessage.PLATFORM_DELETED,
        data: [],
      });
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.PLATFORM_NOT_DELETED,
        data: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: [error.message],
    });
  }
};

export const getPlatformById = async (req, res) => {
  try {
    const findPlatform = await Platform.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (findPlatform) {
      res.status(200).json({
        status: StatusCodes.OK,
        data: findPlatform,
        message: ResponseMessage.PLATFORM_FETCHED,
      });
    } else {
      res.status(400).json({
        status: StatusCodes.OK,
        data: [],
        message: ResponseMessage.PLATFORM_NOT_FOUND,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: [error.message],
    });
  }
};
