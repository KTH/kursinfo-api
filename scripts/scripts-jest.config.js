/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
  return {
    verbose: true,
    testMatch: ['**/scripts/test/*.js'],
  }
}
