# 🏎️ Garage Log - Sistema de Gerenciamento de Manutenções

Este projeto foi desenvolvido como parte de um desafio de desenvolvimento Fullstack para o curso de **Análise e Desenvolvimento de Sistemas**. A aplicação consiste em um PWA (Progressive Web App) para o registro de veículos e histórico de manutenções/modificações automotivas.

**Desenvolvedor:** Kauan Nicolas

---

## Tecnologias Utilizadas

### Backend
- **Node.js & Express:** Servidor e gerenciamento de rotas.
- **MongoDB Atlas:** Banco de dados NoSQL na nuvem.
- **Mongoose (ORM):** Modelagem de dados e persistência.
- **Render:** Hospedagem da API.

### Frontend
- **PWA (Progressive Web App):** Suporte a Service Workers e Manifesto para instalação e uso offline.
- **Bootstrap 5:** Estruturação de layout responsivo.
- **CSS3 (Custom Dark Mode):** Interface temática automotiva premium.
- **Vanilla JavaScript:** Lógica de consumo de API e manipulação do DOM.
- **GitHub Pages:** Hospedagem da interface.

---

## Funcionalidades Principais

### 1. Gestão de Veículos (Nova Entidade)
- Implementação de um CRUD completo para veículos.
- Atributos: Marca, Modelo, Ano e Tipo (Carro/Moto).
- Relacionamento no banco de dados (Cada manutenção é vinculada a um veículo específico).

### 2. Histórico de Manutenções
- Registro de serviços, trocas de peças e modificações.
- Campos: Título do serviço, Descrição detalhada, Data e Veículo relacionado.
- Listagem dinâmica com badges de identificação por veículo.

### 3. Experiência do Usuário (PWA)
- Interface otimizada para dispositivos móveis com visual Dark Mode.
- Capacidade de instalação como aplicativo nativo.
- Sincronização em tempo real com o banco de dados remoto.

---

## Links do Projeto

- **Aplicação em Produção:** [Clique aqui para acessar](https://KauanNic.github.io/garage-log-frontend/)
- **API (Backend):** [Hospedada no Render](https://api-garage-log.onrender.com)