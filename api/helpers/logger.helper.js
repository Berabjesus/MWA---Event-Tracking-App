const separator = "// ---->>>"
module.exports.errorLogger = (fileName, msg) => {
  console.log(process.env.ERROR_LOG, fileName, separator, msg);
}

module.exports.warningLogger = (fileName, msg) => {
  console.log(process.env.WARNING_LOG, fileName, separator, msg);
}

module.exports.infoLogger = (fileName, msg) => {
  console.log(process.env.INFO_LOG, fileName, separator, msg);
}