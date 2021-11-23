import { format } from "date-fns"

export const formatDate = {
  foodLog: (date: Date) => format(date, "MMMM do")
}