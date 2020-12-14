# CAplicação para suporte à COVID-19

## Introdução

O presente trabalho tem o intuito de apresentar a solução adotada para a criação de uma aplicação que emula um dashboard para apoio e suporte no combate à pandemia de COVID-19. 

Esta aplicação tem fins didáticos e expõe uma forma de viabilizar a integração e consulta dos dados relativos à pandemia em uma plataforma única, mostrando as curvas de contágio, óbitos, curados por estados e países e a situação global. Esta solução também viabiliza um dashboard onde as informações consultadas nas Web APIs externas e públicas na internet são exibidas em formatos de gráficos.

Nesta solução foi construída uma estrutura de backend do sistema, feita através de um microsserviço responsável por expor os webservices para consulta das informações no padrão RESTful.

Também foi construído um segundo microsserviço responsável por fazer o papel de Identity Server, gerando tokens para permissionamento do acesso à Web API dos dados da COVID. Este microsserviço também permite o cadastro dos usuários e a sua inclusão em grupos de acesso (em endpoints que fazer as operações de CRUD) e com base neste cadastro, a viabilização de geração de tokens JWT para serem utilizados como Bearer Tokens.

Por fim, foi construído um frontend em AngularJS para consumir a Web API e o microsserviço e renderizar os gráficos e os dados no dashboard.


## Desenho Básico da Solução

![estrutura_final_spring](https://user-images.githubusercontent.com/67294168/99196957-2a083980-276e-11eb-835c-9e216f21b433.png)

## Estruturação do Projeto no GitHub

Foram criados nesta solução três projetos isolados disponíveis no GitHub, sendo: 

    a.	Microserviço CovidWebApi → Microsserviço responsável por gerenciar as consultas aos dados da COVID-19. Os endpoints deste serviço só ficam acessíveis utilizando-se um token de acesso gerado pela solução. Este microsserviço consulta dados da COVID-19 de fontes abertas na internet (com dados internacionais e nacionais), sendo um microsserviço intermediário também atuando como um adaptador e consolidador dos dados retornados de diversas fontes poderem ser estruturados e apresentados.

    b.	Autenticador e Cadastro de Usuários → Microsserviço responsável por gerenciar a recepção dos cadastros dos novos usuários que acessarão os endpoints do microsserviço descrito no item “a”, cadastro deles em grupos e tratativa das gerações dos tokens JWT para permissão de acesso ao microsserviço descrito no item “a”.

    c.	Aplicação de frontend em AngularJS → Esta aplicação é responsável por se autenticar no microsserviço descrito no item “b”, gerar um token JWT e fazer invocações no microsserviço descrito no item “a” para recuperar as informações dos dados da COVID-19. Ela também exibe os dados recuperados em formato de gráficos e tabelas, no formato de um dashboard.


## Bancos de Dados da Aplicação

A solução criada se utiliza do banco de dados H2 para fins didáticos. 
Entretanto, qualquer banco relacional pode ser utilizado, considerando-se a adição das dependências das  bibliotecas respectivas dentro do arquivo "build.gradle" de cada projeto.

### Abaixo está o modelo básico das tabelas utilizadas (MER)

![mer_final_spring](https://user-images.githubusercontent.com/67294168/99196961-2d032a00-276e-11eb-9177-c66d6cc1a4e3.png)


## Swagger - Documentação e Testes

Os projetos Spring Boot Application descritos acima, após iniciados e rodando cada qual em uma porta distinta, expõem as suas interfaces através da biblioteca Swagger.
Com os mesmos já iniciados, basta adicionar a terminação da URL do Swagger conforme exemplo abaixo para cada Web API exposta: 

http://[caminho-host]:[porta]/{context-path}/swagger-ui/
    
Com isso, uma interface de documentação e testes é exposta para cada Web API, conforme imagem abaixo: 

![swagger_2](https://user-images.githubusercontent.com/67294168/99307973-014b7700-2836-11eb-9c9c-ffabd413e447.png)


