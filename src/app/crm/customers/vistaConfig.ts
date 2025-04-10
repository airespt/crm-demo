import { VistasView } from "@/contexts/Vistas/types"

export const vistaConfig = {
  defaultVista: {
    groupId: 'customer', // sets the key for all vistas created from this config
    vistaId: 'default', // leave as 'default' to prevent modifying it's fields in the view
    label: 'Default View', 
    fields: ['CustomerID', 'OrganizationName', 'FederalTaxID', 'Telephone1'],
  } as VistasView,
  // availableFields: [
  //   'CustomerID',
  //   'OrganizationName',
  //   'FederalTaxID',
  //   'Telephone1',
  //   'Address',
  //   'PostalCode',
  //   'Country',
  // ]
}
// availableFields: [
//   {
//     field: 'CustomerID'
//   },
//   {
//     field: 'OrganizationName'
//   },
//   {
//     field: 'FederalTaxID'
//   },
//   {
//     field: 'Telephone1'
//   },
//   {
//     field: 'Address'
//   },
//   {
//     field: 'PostalCode'
//   },
//   {
//     field: 'Country'
//   },
// ]
