# README - Sistema de Agendamento de Vacinação - Back-End

## Descrição

Diante da alta demanda por vacinas contra COVID-19, nossa cidade precisa de um sistema simples para gerenciar agendamentos de vacinação. Este projeto visa construir um portal que permita aos usuários agendar pacientes para vacinação e consultar os agendamentos por dia e horário.

## Requisitos

- **Agendamento**: Deve ser feito através de um formulário.
- **Disponibilidade**: 20 vagas por dia, com 2 agendamentos por horário.
- **Consulta**: Página para visualizar agendamentos agrupados por dia e horário.
- **Intervalo**: 1 hora entre agendamentos.

## Regras de Negócio

- **Informações do Paciente**: Nome, data de nascimento, dia e horário do agendamento.
- **Validação**: O formulário deve ser validado.
- **Armazenamento**: Dados dos agendamentos armazenados em memória.
- **Feedback**: Mensagem de sucesso em um modal/popup.
- **Persistência**: Dados não devem ser perdidos ao recarregar a página.
- **Consultas**: Listagem de agendamentos e status do atendimento.

## Tecnologias Utilizadas

- **Front-end**: React, react-datepicker, Formik (com Yup) ou React Hook Forms (ZOD), ContextAPI.
- **Back-end**: Node.js, Express, Prisma.
- **Client HTTP**: Axios.
- **Testes**: Jest.

## Instalação

### Requisitos

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Passos para Instalação

1. **Clone o repositório**:

    ```bash
    git clone https://github.com/GabriellyAnisio/ImunizaPortal-backend.git
    ```

2. **Navegue para o diretório do projeto**:

    ```bash
    cd projeto-agendamento
    ```

3. **Instale as dependências**:

    ```bash
    npm install
    # ou
    yarn install
    ```

4. **Inicie o servidor**:

    ```bash
    npm start
    # ou
    yarn start
    ```

## Testes

Para garantir a qualidade do código, foram implementados testes utilizando Jest. Para rodar os testes, execute o comando:

```bash
npm test
# ou
yarn test
```

Lembre-se de que é necessário ajustar o cabeçalho e o rodapé dos arquivos `src/controllers/appointment.controller.mjs` e `src/utils/prismaClient.mjs` antes de executar os testes.


## Contato

Para dúvidas ou mais informações, entre em contato com [mgabriellyanisio@gmail.com](mailto:mgabriellyanisio@gmail.com).

---