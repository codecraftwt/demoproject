export interface Filter {
  id: number, 
  columnField: string
  operatorValue: string, // "and", "or"
  value?: number | string
}