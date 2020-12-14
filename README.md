# Aplicação para suporte à COVID-19 - FIAP 2020

## Introdução

O presente trabalho tem o intuito de apresentar a solução adotada para a criação de uma aplicação que emula um dashboard para apoio e suporte no combate à pandemia de COVID-19. 

Esta aplicação tem fins didáticos e expõe uma forma de viabilizar a integração e consulta dos dados relativos à pandemia em uma plataforma única, mostrando as curvas de contágio, óbitos, curados por estados e países e a situação global. Esta solução também viabiliza um dashboard onde as informações consultadas nas Web APIs externas e públicas na internet são exibidas em formatos de gráficos.

Nesta solução foi construída uma estrutura de backend do sistema, feita através de um microsserviço responsável por expor os webservices para consulta das informações no padrão RESTful.

Também foi construído um segundo microsserviço responsável por fazer o papel de Identity Server, gerando tokens para permissionamento do acesso à Web API dos dados da COVID. Este microsserviço também permite o cadastro dos usuários e a sua inclusão em grupos de acesso (em endpoints que fazer as operações de CRUD) e com base neste cadastro, a viabilização de geração de tokens JWT para serem utilizados como Bearer Tokens.

Por fim, foi construído um frontend em AngularJS para consumir a Web API e o microsserviço e renderizar os gráficos e os dados no dashboard.


## Desenho Básico da Solução

![trabalho_final_ws](https://user-images.githubusercontent.com/67294168/102129916-e10bd980-3e2e-11eb-82a1-39d639003373.png)

## Estruturação do Projeto no GitHub

Foram criados nesta solução três projetos isolados disponíveis no GitHub, sendo: 

a.	Microserviço CovidWebApi → Microsserviço responsável por gerenciar as consultas aos dados da COVID-19. Os endpoints deste serviço só ficam acessíveis utilizando-se um token de acesso gerado pela solução. Este microsserviço consulta dados da COVID-19 de fontes abertas na internet (com dados internacionais e nacionais), sendo um microsserviço intermediário também atuando como um adaptador e consolidador dos dados retornados de diversas fontes poderem ser estruturados e apresentados.

b.	Autenticador e Cadastro de Usuários → Microsserviço responsável por gerenciar a recepção dos cadastros dos novos usuários que acessarão os endpoints do microsserviço descrito no item “a”, cadastro deles em grupos e tratativa das gerações dos tokens JWT para permissão de acesso ao microsserviço descrito no item “a”.

c.	Aplicação de frontend em AngularJS → Esta aplicação é responsável por se autenticar no microsserviço descrito no item “b”, gerar um token JWT e fazer invocações no microsserviço descrito no item “a” para recuperar as informações dos dados da COVID-19. Ela também exibe os dados recuperados em formato de gráficos e tabelas, no formato de um dashboard.


## Bancos de Dados da Aplicação

A solução criada se utiliza do banco de dados H2 para fins didáticos. 
Entretanto, qualquer banco relacional pode ser utilizado, considerando-se a adição das dependências das  bibliotecas respectivas dentro do arquivo "build.gradle" de cada projeto.

### Abaixo está o modelo básico das tabelas utilizadas (MER)

![Diagrama em branco](https://user-images.githubusercontent.com/67294168/102129921-e23d0680-3e2e-11eb-9839-cf5975dbeba2.png)

## Swagger - Documentação e Testes

Os projetos Spring Boot Application descritos acima, após iniciados e rodando cada qual em uma porta distinta, expõem as suas interfaces através da biblioteca Swagger.
Com os mesmos já iniciados, basta adicionar a terminação da URL do Swagger conforme exemplo abaixo para cada Web API exposta: 

http://[caminho-host]:[porta]/{context-path}/swagger-ui/
    
Com isso, uma interface de documentação e testes é exposta para cada Web API, conforme imagem abaixo: 

![swagger](https://user-images.githubusercontent.com/67294168/102131951-ba9b6d80-3e31-11eb-96b6-73fce8089a1a.png)




## Simulação de Uso dos Endpoints

a)	Obtendo um token da API de segurança (POST)
/autenticação 

__ATENÇÃO: Este clientID abaixo está fixado para fins didáticos. Em uma situação normal, os usuários poderiam ser cadastrados e a partir deles, os tokens gerados. Como o objetivo aqui é somente demonstrar a geração do token a partir de um usuário valido, fixamos o body abaixo e os dados em questão no banco H2 em memória!__

Body da Requisição

        {
          "clientId": "123456",
          "clientSecret": "13245487",
          "grantType": "password",
          "password": "121294",
          "user": "123456"
        }

      Retorno da Resposta:

        { 
            "AcessToken": ”eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwNzg2ODQwMjg1NyIsImlhdCI6MTYwNTQ2MjkyOSwiXhwIjoxNjA1NDgwOTI5fQ.zCdt-AhKk3rooyXYirASpn_LiaQtP-MPKKa0fNR3IY” 
        } 


b)	Validando um token da API de segurança (GET)
/autenticação 

Body da Requisição

        { 
            "token": ”Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwNzg2ODQwMjg1NyIsImlhdCI6MTYwNTQ2MjkyOSwiXhwIjoxNjA1NDgwOTI5fQ.zCdt-AhKk3rooyXYirASpn_LiaQtP-MPKKa0fNR3IY” 
        } 

Retorno do token JWT para ser passado no Header das chamadas: 

        {
          "rules": [
            "string"
          ],
          "tipo": "string",
          "username": "string"
        }


c)	Consultando os dados de um Estado do específico do Brasil (GET)
/covid/estado/{estado}?periodoDe=yyyy-MM-dd&periodoAte= yyyy-MM-dd 

Retorno do token JWT para ser passado no Header das chamadas: 

        {
          "estado": "string",
          "nome": "string",
          "periodos": [
            {
              "casos": 0,
              "data": "string",
              "mortes": 0,
              "recuperados": 0
            }
          ],
          "totaisPeriodo": {
            "casos": 0,
            "mortes": 0,
            "recuperados": 0
          }
        }
 


d)	Consultando os dados de diversos estados ao mesmo tempo (GET)
/covid/estado?estados=sp,rj,mg,am&periodoDe=yyyy-MM-dd&periodoAte= yyyy-MM-dd 

        [
          {
            "estado": "string",
            "nome": "string",
            "periodos": [
              {
                "casos": 0,
                "data": "string",
                "mortes": 0,
                "recuperados": 0
              }
            ],
            "totaisPeriodo": {
              "casos": 0,
              "mortes": 0,
              "recuperados": 0
            }
          }
        ]

e)	Consultando os dados de um país específico
/covid/país/{país}?periodoDe=yyyy-MM-dd&periodoAte= yyyy-MM-dd

        {
          "nome": "string",
          "pais": "string",
          "periodos": [
            {
              "casos": 0,
              "data": "string",
              "mortes": 0,
              "recuperados": 0
            }
          ],
          "totaisPeriodo": {
            "casos": 0,
            "mortes": 0,
            "recuperados": 0
          }
        }


f)	Consultando os dados de diversos países do mundo ao mesmo tempo
/covid/pais?paises=brazil,canada,china&periodoDe=yyyy-MM-dd&periodoAte= yyyy-MM-dd	

        [
          {
            "nome": "string",
            "pais": "string",
            "periodos": [
              {
                "casos": 0,
                "data": "string",
                "mortes": 0,
                "recuperados": 0
              }
            ],
            "totaisPeriodo": {
              "casos": 0,
              "mortes": 0,
              "recuperados": 0
            }
          }
        ]

g)	Consultando os dados globais da COVID-19

        /covid/global
        {
          "periodos": [
            {
              "casos": 0,
              "data": "string",
              "mortes": 0,
              "recuperados": 0
            }
          ],
          "totaisPeriodo": {
            "casos": 0,
            "mortes": 0,
            "recuperados": 0
          }
        }


## Conclusão

Nos últimos anos a integração entre sistemas evoluiu muito. Para quem passou por diversas tecnologias como RMI, Corba, COM+, dentre outras, atualmente se tem muito menos sofrimento e trabalho na criação de serviços web após o advento da padronização dos webservices no início da década dos anos 2000.

Com a chegada do XML, padrões e protocolos baseados em arquivos de configuração com contratos pré-definidos e fortemente tipados se tornaram muito mais comuns. O padrão SOAP se tornou eficiente para integrações entre sistemas de maneira segura e eficaz e possibilitou a evolução para os padrões que culminaram na arquitetura SOA, onde as aplicações passaram a ser pensadas muito mais em relação aos serviços que oferecem e expõem do que em relação às telas e funcionalidades que detém.

Com o aumento e difusão das tecnologias móveis, onde a comunicação entre sistemas, apps e softwares com servidores físicos ou não, máquinas virtuais ou serviços em Cloud se tornou cada vez mais necessário, outras tecnologias abaram se destacando, como o Javascript, o AJAX (feito em Javascript) e com isso, outros formatos de estruturação de dados, como o JSON.

esta forma, pode-se evoluir o desenvolvimento das aplicações, tornando-as desacopladas por natureza e onde os contratos passaram a ser estruturas em JSON indo e vindo entre estas aplicações, que no final só se conheciam e se conectavam pelo respeito a estes contratos.

Com isso diversas possibilidades se abriram. A aplicação descrita neste trabalho é um exemplo de desenvolvimento rápido buscando dados na internet sobre informações relevantes e a exposição destes dados de maneira segura (usando protocolos de segurança como o OAuth e tokens JTW) e relativamente simples em qualquer tecnologia de frontend que manipule JSON.

Outras tecnologias de backend se desenvolveram concomitantemente para facilitar ainda mais o desenvolvimento de Web APIs, webservices e arquiteturas baseadas em serviços, como Node.js, Spring, .Net Core, dentre outras. E cada vez mais temos desenvolvido aplicações desacopladas que se invocam entre si respeitando os seus contratos de serviço.

Assim, a Tecnologia da Informação poderá ter o seu foco no que realmente interessa a ela, que é a manipulação dos dados diversos para gerar informação, abstraindo-se a complexidade interna e inerente de cada sistema e fazendo com que cada um deles se resolva com os dados que manipula, gerando o valor ao que se propôs.



