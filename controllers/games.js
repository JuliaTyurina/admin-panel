// Получим игры из JSON-файла и отправим в ответ на запрос
const sendAllGames = async (req, res) => {
    res.send(req.games);
};

const sendUpdatedGames = async (req, res) => {
    // В качестве ответа отправляем объект с двумя полями
    res.send({
        games: req.games, // Обновлённый список со всеми играми
        updated: req.updatedObject // Новая добавленная игра
    });
}

module.exports = {
    sendAllGames,
    sendUpdatedGames
}