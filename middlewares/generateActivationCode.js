const generateActivationCode = () => {
  const charactters = "0123456789";
  let activationCode = "";
  for (let i = 0; i <= 5; i++) {
    activationCode +=
      charactters[Math.floor(Math.random() * charactters.length)];
  }
  return activationCode;
};

module.exports = generateActivationCode;
