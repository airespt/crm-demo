Entity     | UseCase              | Service             | Controller/actions
           |                      |  verifica permissao | verifica session atual
           |                      |                     | fornece user e permissions

Controller/actions -> Services -> Repos -> DB

Repos
  Criam dataModels e retornam dataEntities completos
  Podem encapsular varias operações para manter a DB em sync com as Entities

Services
  Chamam os repos para executar as operações
  Omitem campos sensiveis, tainting (ex. password) substituindo por vazio ("")
  Retornam dataEntities seguras para o client

Server actions
  Validam as permissoes do user da sessão
  Validam o formato do request
  Chamam os services para executar as operações
  Interceptam throws e formatam o resultado para o client
