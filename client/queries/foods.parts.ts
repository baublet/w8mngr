import measurementParts from "./measurement.parts";

export default `
  id,
  name,
  description,
  measurements {
    ${measurementParts}
  }
`;
