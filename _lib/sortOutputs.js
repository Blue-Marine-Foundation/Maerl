export default function sortOutputs(outputs) {
  let sortedOuputs = outputs
    .map((output) => {
      const outputNumber = parseInt(output.code.split('.')[1]);
      return {
        outputNumber,
        ...output,
      };
    })
    .sort((a, b) => a.outputNumber - b.outputNumber);

  if (sortedOuputs && sortedOuputs[0].outputNumber === 0) {
    const unplannedOuput = sortedOuputs.shift();
    if (unplannedOuput) {
      sortedOuputs.push(unplannedOuput);
    }
  }

  return sortedOuputs;
}
