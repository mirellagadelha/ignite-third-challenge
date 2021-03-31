const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryExists(request, response, next){
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found." });
  }

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { repository } = request;
  const updatedRepository = request.body;

  const repositoryIndex = repositories.indexOf(repository);

  if (updatedRepository.likes) {
    updatedRepository.likes = repository.likes;
  }

  const newRepository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { repository } = request;

  const repositoryIndex = repositories.indexOf(repository);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const { repository } = request;

  repository.likes += 1;

  return response.json({ likes: repository.likes });
});

module.exports = app;
