// Test utility to verify all fixes are working
import { getCounsellorForStudent } from '../services/facultyAssignmentService';
import profileService from '../services/profileService';
import profilePhotoService from '../services/profilePhotoService';

export const testAllFixes = async () => {
  console.log('🧪 Testing all fixes...');
  
  const testUserId = '1253171b-ecae-4ea8-bbb9-cc6303e1b50e';
  const testStudentHtNo = '23891A7228';
  
  // Test 1: Faculty Assignment Service
  console.log('📋 Test 1: Faculty Assignment Service');
  try {
    const counsellorData = await getCounsellorForStudent(testStudentHtNo);
    console.log('✅ Counsellor data:', counsellorData);
  } catch (error) {
    console.error('❌ Faculty assignment test failed:', error);
  }
  
  // Test 2: Profile Service
  console.log('📋 Test 2: Profile Service');
  try {
    const profileData = await profileService.getStudentProfile(testUserId);
    console.log('✅ Profile data:', profileData);
  } catch (error) {
    console.error('❌ Profile service test failed:', error);
  }
  
  // Test 3: Profile Photo Service (mock file)
  console.log('📋 Test 3: Profile Photo Service');
  try {
    // Create a mock file for testing
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const uploadResult = await profilePhotoService.uploadProfilePhoto(testUserId, mockFile, 'student');
    console.log('✅ Upload result:', uploadResult);
  } catch (error) {
    console.error('❌ Profile photo test failed:', error);
  }
  
  console.log('🎯 All tests completed!');
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testAllFixes = testAllFixes;
}
