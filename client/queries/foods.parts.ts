export default `
  id,
  name,
  description,
  measurements {
    id,
    food_id,
    amount,
    unit,
    calories,
    fat,
    carbs,
    protein
  }
`;
