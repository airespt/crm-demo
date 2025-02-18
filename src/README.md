Entity     | UseCase              | Service             | Controller/actions
           |                      |  verifica permissao | verifica session atual
           |                      |                     | fornece user e permissions

Controller/actions -> Services -> Repos -> DB

Repos
  Criam dataModels e retornam dataEntities completos

Services
  Omitem campos sensiveis (ex. password) substituindo por vazio ("")
  chamam os repos para executar as operações
  retornam dataEntities seguras para o client

Server actions
  validam as permissoes do user da sessão
  validam o formato do request
  chamam os services para executar as operações
  catch errors e formatam o resultado para o client
