#  PROJETO ALAR-MED

Controle inteligente de medicamentos desenvolvido em React.js e Firebase.

##  Funcionalidades

O ALAR-MED permite aos usuários gerenciar sua medicação com as seguintes funcionalidades:

* **Autenticação Completa:** Cadastro e Login de usuários (via Firebase Auth).
* **Gestão de Medicamentos (CRUD):** Criar, Visualizar, Editar e Excluir medicamentos.
* **Controle em Tempo Real:** Listagem de medicamentos atualizada instantaneamente (Firestore Real-time).
* **Histórico de Uso:** Visualização e filtragem do histórico de medicamentos tomados.
* **Proteção de Rotas:** Acesso restrito apenas para usuários autenticados.

##  Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando uma arquitetura moderna de Frontend com Backend as a Service (BaaS):

| Camada | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React.js (Hooks, JSX) | Construção da interface do usuário (SPA). |
| **Roteamento** | React Router DOM | Navegação entre as páginas. |
| **Backend/DB** | Firebase Firestore | Banco de Dados NoSQL e sincronização em Tempo Real (`onSnapshot`). |
| **Autenticação** | Firebase Authentication | Serviço de Login e Registro. |
| **Utils** | date-fns | Manipulação e formatação de datas/horários. |

##  Arquitetura do Software

A arquitetura se baseia em componentes e segurança de dados:

1.  **Rotas Protegidas:** O componente `<RequireAuth>` impede o acesso a áreas como `/home` e `/cadastro` se o usuário não estiver logado.
2.  **Segurança e Privacidade:** Todas as consultas de dados no Firestore são filtradas utilizando o `userId` do usuário logado (usando `where("userId", "==", user.uid)`), garantindo que cada pessoa visualize apenas seus próprios dados.
3.  **Real-Time Data:** O uso do `onSnapshot` no `Home.jsx` e `Historico.jsx` mantém a aplicação sempre sincronizada com o banco de dados.

## 📦 Estrutura do Projeto

Abaixo a visão do diretório principal:l fight

## 🧑💻 Desenvolvedores

| Aluno | RA |
| :--- | :--- |
| **Fernando de Jesus Pereira da Silva** | 324113710 |
| **Gabriel Henrique Ferreira Souza** | 324143764 |
