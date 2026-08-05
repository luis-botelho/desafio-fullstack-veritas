<div align="center">

<img src="./docs/assets/banner.png" alt="Mini Kanban Veritas Banner" width="100%"/>

# 🗂️ Mini Kanban Veritas

**Desafio técnico de estágio Full Stack — Veritas Consultoria Empresarial**

Aplicação full stack para criar, organizar e mover tarefas em um quadro Kanban.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=flat&logo=typescript&logoColor=white)
![Go](https://img.shields.io/badge/Go-1.22-00ADD8?style=flat&logo=go&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/status-MVP%20concluído-2ECC71?style=flat)

</div>

---

## 📌 Sobre

O Mini Kanban permite criar, editar, mover e excluir tarefas em três colunas fixas
(**A Fazer**, **Em Progresso** e **Concluídas**) utilizando um backend em Go e um
frontend em React consumindo uma API REST em tempo real.

Este repositório é dividido em dois projetos independentes:

- 📦 [`backend/`](./backend/README.md) — API REST em Go
- 🎨 [`frontend/`](./frontend/README.md) — Interface React + TypeScript

---

# 🎬 Aplicação em funcionamento

<p align="center">

<img src="./docs/assets/demo.gif" width="900"/>

</p>

---

# 📸 Interface da aplicação

## Quadro Kanban

<p align="center">

<img src="./docs/assets/home.png" width="900"/>

</p>

---

## Criando uma tarefa

<p align="center">

<img src="./docs/assets/create-task.png" width="900"/>

</p>

---

## Movimentação entre colunas

<p align="center">

<img src="./docs/assets/drag-drop.png" width="900"/>

</p>

---

## Confirmação de exclusão

<p align="center">

<img src="./docs/assets/delete-task.png" width="900"/>

</p>

---

## ✨ Funcionalidades

- Três colunas fixas com CRUD completo integrado à API.
- Drag-and-drop nativo entre colunas.
- Alteração de status pelo formulário (alternativa para touch e teclado).
- Criação de tarefas diretamente na coluna desejada.
- Confirmação antes da exclusão.
- Feedback contextual contendo o nome da tarefa.
- Mensagens temporárias com fechamento automático.
- Estados de carregamento, erro e colunas vazias.
- Navegação completa via teclado.
- Layout responsivo.

---

## 🏗️ Arquitetura geral

```mermaid
flowchart LR
    A["React + TypeScript<br/>Frontend"] -->|"HTTP / JSON"| B["Go + Chi Router"]
    B -->|"sync.RWMutex"| C[("Memory Repository")]
