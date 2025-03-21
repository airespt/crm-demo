### Vistas das tabelas
#### VistasContext
  Usar o VistasContextProvider inicializado com um VistaConfig.

  Cada vistaConfig é um objeto e contem a descrição da vista default

  Ao criar um novo VistasGroup, deve-se ajustar o groupId, e os fields iniciais da 'Default View'

  O VistasContextProvider deve ficar como parent da tabela que consome as vistas.
  
  Para selecionar diferentes vistas, deve usar-se o VistasSelect obtido do useVistasContext hook. Este componente, VistasSelect, apresenta um botão que abre o modal do editor de vistas
  
  Para configurar as vistas, usar o componente EditVistasModal.

  ver CustomerTable.tsx como exemplo

vista é uma chave composta que descreve a lista e ordem dos campos
vista é um array de fieldNames
(largura dos campos fica para uma feature futura)
v1 vistas gerais
v2 vistas por user

tableFields são obtidos do PrismaClient


#### vistasService
- vistasService.list
- vistasService.update
- vistasService.listFields

##### vistasService.list
Retorna um VistaGroup que contem:
  - groupId é a Key do grupo de vistas
  - favouriteVista é o id da vista predefinida
  - vistas é a lista de vistas deste group

Cada Vista contem um par de keys groupId e vistaId, um label, e uma lista de fields que representa os fields visiveis e em que ordem.


##### vistasService.update
Recebe um VistaGroup e atualiza tudo na DB.
Tem capacidade para guardas vistas novas, modificar vistas atuais e apagar vistas numa só chamada.

##### vistasService.listFields
Retorna uma lista com todos os fields disponiveis na tabela sage correspondente ao groupId.


#### NOTA
A primeira chamada num VistaGroup novo retorna uma lista de vistas vazia. Neste caso, a View injeta a Vista Default definida no vistaConfig.
