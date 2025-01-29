Entity     | UseCase              | Service             | Controller/actions
           |                      |  verifica permissao | verifica session presente
           |                      |                     | fornece user e permissions

DB -> RepoAdapter

Repos criam dataModels e retornam dataEntities completos

Services omitem campos sensiveis (ex. password) substituindo por vazio ("")

Server actions validam as permissoes do user da sessão