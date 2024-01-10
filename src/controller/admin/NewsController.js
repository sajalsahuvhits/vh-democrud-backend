import { StatusCodes } from "http-status-codes";
import { News } from "../../model/News.js";
import { ResponseMessage } from "../../utils/ResponseMessage.js";
import { createApi, updateApi } from "../../services/admin/AdminServices.js";

export const addEditNews = async (req, res) => {
  try {
    if (req.body.id) {
      let findImage = await News.findById({ _id: req.body.id });
      let prevImg = findImage?.prevImg;
      req.body.image = req.fileurl ? req.fileurl : prevImg;
      const updateNews = await updateApi(req.body, News);
      if (updateNews) {
        if (prevImg) {
          fs.unlink("./public/uploads/" + prevImg.split("/").pop(), () => {
            console.log("image deleted");
          });
        }
        return res.status(200).json({
          status: StatusCodes.OK,
          message: ResponseMessage.NEWS_UPDATED,
          data: updateNews,
        });
      } else {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.NEWS_NOT_UPDATED,
        });
      }
    } else {
      const checkNews = await News.find({ title: req.body.title, isDeleted: false });
      if (checkNews.length) {
        return res.status(409).json({
          status: StatusCodes.CONFLICT,
          message: ResponseMessage.NEWS_ALREADY_CREATED,
          data: [],
        });
      } else {
        req.body.image = req.fileurl;
        req.body.createdBy = req.admin;
        const saveNews = await createApi(req.body, News);
        if (saveNews) {
          return res.status(201).json({
            status: StatusCodes.CREATED,
            message: ResponseMessage.NEWS_CREATED,
            data: saveNews,
          });
        } else {
          return res.status(400).json({
            status: StatusCodes.OK,
            message: ResponseMessage.NEWS_NOT_CREATED,
            data: [],
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: [error.message],
    });
  }
};

export const getNews = async (req, res) => {
  try {
    const findNews = await News.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate("createdBy")
      .populate({
        path: "gameId",
        populate: [{ path: "genre" }, { path: "platform" }],
      });
    if (findNews) {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: ResponseMessage.NEWS_FETCHED,
        data: findNews,
      });
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.NEWS_NOT_FOUND,
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

export const deleteNews = async (req, res) => {
  try {
    const newsDelete = await News.findByIdAndUpdate(
      req.body.id,
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (newsDelete) {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: ResponseMessage.NEWS_DELETED,
        data: [],
      });
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.NEWS_NOT_DELETED,
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

export const getNewsById = async (req, res) => {
  try {
    const findNews = await News.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("createdBy")
      .populate({
        path: "gameId",
        populate: [{ path: "genre" }, { path: "platform" }],
      });
    if (findNews) {
      res.status(200).json({
        status: StatusCodes.OK,
        data: findNews,
        message: ResponseMessage.NEWS_FETCHED,
      });
    } else {
      res.status(400).json({
        status: StatusCodes.OK,
        data: [],
        message: ResponseMessage.NEWS_NOT_FOUND,
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
