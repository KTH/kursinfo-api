/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
  return {
    verbose: true,
    testMatch: ['**/integration/tests/*.js'],
  }
}
