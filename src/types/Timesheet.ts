
export interface Answer {
  field: string, // Do we need to store the field name??
  question: string, // Store the original question
  answer: boolean | string | null
}

export interface Option {
  label: string,
  value: boolean
}

export interface Field {
  fieldType: string,
  name: string, // This needs to be auto-generated once user's create their own questions
  label: string,
  isRequired: boolean,
  options?: Option[],
  sortOrder?: number // Fields should be sorted from api,
  defaultValue: boolean | string | number,
  answer?: boolean | string | number,
}

export interface CostCode {
  costCode: string, // reference to cost code
  // value: string,
  // label: string,
  percentage: number,
}