const { readData, writeData } = require("../utils/data"); // Чтение и запись данных в JSON-файл


// Получим игры из JSON-файла
const getAllGames = async (req, res, next) => {
  const games = await readData("./utils/data/games.json");
  if (!games) {
    res.status(400);
    res.send({
      status: "error",
      message: "Нет игр в базе данных. Добавьте игру."
    });
    return;
  }
  req.games = games;
  next()
};

const checkIsTitleInArray = (req, res, next) => {
  // Проверяем, есть ли уже в списке игра с таким же названием
  req.isNew = !Boolean(req.games.find(item => item.title === req.body.title));
  next()
}

const updateGamesArray = (req, res, next) => {
  // Если игра, которую хотим добавить, новая (её не было в списке)
  if (req.isNew) {
    // Добавляем объект с данными о новой игре
    const inArray = req.games.map(item => Number(item.id));
    let maximalId;
    if (inArray.length > 0) {
      maximalId = Math.max(...inArray);
    } else {
      maximalId = 0;
    }
    req.updatedObject = {
      id: maximalId + 1,
      title: req.body.title,
      image: req.body.image,
      link: req.body.link,
      description: req.body.description
    };
    // Добавляем данные о новой игре в список с другими играми
    req.games = [...req.games, req.updatedObject];
    next()

  } else {
    res.status(400);
    res.send({ status: "error", message: "Игра с таким именем уже есть." });
    return
  }
}

const updateGamesFile = async (req, res, next) => {
  // Записываем обновлённый список игр в файл
  await writeData("./utils/data/games.json", req.games);
  next()
}

const findGameById = (req, res, next) => {
  // Прочитаем запрашиваемый id игры из запроса
  const id = Number(req.params.id);
  // Найдём игру, которую хотят удалить, в общем массиве с играми по id
  req.game = req.games.find((item) => item.id === id);
  next();
};

const deleteGame = (req, res, next) => {
  const id = req.game.id;
  // Найдём индекс удаляемой игры в общем массиве игр
  const index = req.game.findIndex((item) => item.id === id);

  // Удалим из массива игр игру
  req.games.splice(index, 1);
}


module.exports = {
  getAllGames,
  checkIsTitleInArray,
  updateGamesArray,
  updateGamesFile,
  findGameById,
  deleteGame
}