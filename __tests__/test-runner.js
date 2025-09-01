const { execSync } = require('child_process');

console.log('🧪 Running AstroSuite Pro Tests...\n');

try {
  // Run Jest tests with coverage
  const result = execSync('npm test -- --coverage --verbose', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ All tests passed!');
  console.log(result);
} catch (error) {
  console.log('❌ Some tests failed:');
  console.log(error.stdout || error.message);
  
  // Show test summary
  try {
    const summary = execSync('npm test -- --passWithNoTests', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('\n📊 Test Summary:');
    console.log(summary);
  } catch (summaryError) {
    console.log('Could not generate test summary');
  }
}
