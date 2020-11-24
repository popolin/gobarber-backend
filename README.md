
<br>

<p align="center">
  <img alt="Proffy" src="https://popolin.s3-sa-east-1.amazonaws.com/site/logo.png" width="250px">
</p>

## 🚀 Technologies

This project was developed with the following technologies:

- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org)

## 💻 Project

System backend for barber shop reservations.

## 🔬 Context

Part of Gostack Bootcamp at [RocketSeat](https://rocketseat.com.br).

## 🖥 Funcionalidades pendentes


# Recuperação de senha
**RF**
- O usuário deve poder listar os prestadores cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve poder listar os horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF**
- A listagem de prestadores deve ser armazenada em cache;

**RN**
- Cada agendamento deve durar 1h;
- Os agendamentos devem estar disponíveis das 08:00 às 18:00 (primeiro as 8 e último as 17);
- O usuário não pode agendar em um horário já agendado;
- O usuário não pode agendar em data passada;
- O usuário não pode agendar serviço consigo mesmo;


# Atualização do perfil
**RF**
- O usuário deve poder atualizar seu perfil: nome, email e senha;

**RN**
- O usuário não pode alterar seu email para um email já utilizado por outro usuário;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;

# Painel do prestador
**RF**
- O usuário deve poder atualizar seu perfil: nome, email e senha;

**RN**
- O usuário não pode alterar seu email para um email já utilizado por outro usuário;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;


# Painel do prestador
**RF**
- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**
- Os agendamentos do prestador do dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo real utilizando socket-io;

**RN**
- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços
**RF**
- O usuário deve poder atualizar seu perfil: nome, email e senha;

**RN**
- O usuário não pode alterar seu email para um email já utilizado por outro usuário;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;
