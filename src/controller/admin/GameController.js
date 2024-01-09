import { StatusCodes } from "http-status-codes";
import { Genre } from "../../model/Genre.js";
import { Game } from "../../model/Game.js";
import { ResponseMessage } from "../../utils/ResponseMessage.js";
import fs from "fs";
//
// Genre
//
export const addEditGenre = async (req, res) => {
  try {
    if (req.body.id) {
      const checkGenre = await Genre.find({
        _id: { $ne: req.body.id },
        title: req.body.title,
        isDeleted: false,
      });
      if (checkGenre.length) {
        return res.status(409).json({
          status: StatusCodes.CONFLICT,
          message: ResponseMessage.GENRE_ALREADY_CREATED,
          data: [],
        });
      }
      const updateGenre = await Genre.findByIdAndUpdate(req.body.id, req.body);
      if (updateGenre) {
        return res.status(200).json({
          status: StatusCodes.OK,
          message: ResponseMessage.GENRE_UPDATED,
          data: updateGenre,
        });
      } else {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.GENRE_NOT_UPDATED,
          data: [],
        });
      }
    } else {
      const checkGenre = await Genre.find({
        title: req.body.title,
        isDeleted: false,
      });
      if (checkGenre.length) {
        return res.status(409).json({
          status: StatusCodes.CONFLICT,
          message: ResponseMessage.GENRE_ALREADY_CREATED,
          data: [],
        });
      }
      const saveGenre = await Genre.create(req.body);
      if (saveGenre) {
        return res.status(201).json({
          status: StatusCodes.CREATED,
          message: ResponseMessage.GENRE_CREATED,
          data: saveGenre,
        });
      } else {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.GENRE_NOT_CREATED,
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

export const getGenre = async (req, res) => {
  try {
    const getGenre = await Genre.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    if (getGenre) {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: ResponseMessage.GENRE_FETCHED,
        data: getGenre,
      });
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.GENRE_NOT_FOUND,
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

export const deleteGenre = async (req, res) => {
  try {
    const genreDelete = await Genre.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (genreDelete) {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: ResponseMessage.GENRE_DELETED,
        data: [],
      });
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.GENRE_NOT_DELETED,
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

export const getGenreById = async (req, res) => {
  try {
    const findGenre = await Genre.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (findGenre) {
      res.status(200).json({
        status: StatusCodes.OK,
        data: findGenre,
        message: ResponseMessage.GENRE_FETCHED,
      });
    } else {
      res.status(400).json({
        status: StatusCodes.OK,
        data: [],
        message: ResponseMessage.GENRE_NOT_FOUND,
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

//
// Game
//

export const addEditGame = async (req, res) => {
  try {
    let findImage = await Game.findOne({ _id: req.body.id });
    let prevImg = findImage?.image;
    req.body.image = req.fileurl ? req.fileurl : prevImg;
    if (req.body.id) {
      const checkGame = await Game.find({
        _id: { $ne: req.body.id },
        title: req.body.title,
        isDeleted: false,
      });
      if (checkGame.length) {
        return res.status(409).json({
          status: StatusCodes.CONFLICT,
          message: ResponseMessage.GAME_ALREADY_CREATED,
          data: [],
        });
      }
      const updateGame = await Game.findByIdAndUpdate(req.body.id, req.body, {
        new: true,
      });
      if (updateGame) {
        if (prevImg) {
          fs.unlink("./public/uploads/" + prevImg.split("/").pop(), () => {
            console.log("image deleted");
          });
        }
        return res.status(200).json({
          status: StatusCodes.OK,
          message: ResponseMessage.GAME_UPDATED,
          data: updateGame,
        });
      } else {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.GAME_NOT_UPDATED,
        });
      }
    } else {
      const checkGame = await Game.find({
        title: req.body.title,
        isDeleted: false,
      });
      if (checkGame.length) {
        return res.status(409).json({
          status: StatusCodes.CONFLICT,
          message: ResponseMessage.GAME_ALREADY_CREATED,
          data: [],
        });
      } else {
        const saveGame = await Game.create(req.body);
        if (saveGame) {
          return res.status(201).json({
            status: StatusCodes.CREATED,
            message: ResponseMessage.GAME_CREATED,
            data: saveGame,
          });
        } else {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: ResponseMessage.GAME_NOT_CREATED,
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

export const getGame = async (req, res) => {
  try {
    const getGame = await Game.find({ isDeleted: false })
      .populate("genre platform")
      .sort({ createdAt: -1 });
    if (getGame) {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: ResponseMessage.GAME_FETCHED,
        data: getGame,
      });
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.GAME_NOT_FOUND,
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

export const deleteGame = async (req, res) => {
  try {
    const gameDelete = await Game.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (gameDelete) {
      if (gameDelete.image) {
        fs.unlink(
          "./public/uploads/" + gameDelete.image?.split("/").pop(),
          () => {
            console.log("game image deleted");
          }
        );
      }
      return res.status(200).json({
        status: StatusCodes.OK,
        message: ResponseMessage.GAME_DELETED,
        data: [],
      });
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.GAME_NOT_DELETED,
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

export const getGameById = async (req, res) => {
  try {
    const findGame = await Game.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("genre platform");
    if (findGame) {
      res.status(200).json({
        status: StatusCodes.OK,
        data: findGame,
        message: ResponseMessage.GAME_FETCHED,
      });
    } else {
      res.status(400).json({
        status: StatusCodes.OK,
        data: [],
        message: ResponseMessage.GAME_NOT_FOUND,
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
