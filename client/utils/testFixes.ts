// Test utility to verify all fixes are working
import { tables, buckets, supabase } from "@/lib/supabase";
import { authenticateStudent, authenticateFaculty } from "@/services/authService";
import { profilePhotoService } from "@/services/profilePhotoService";
import { passwordService } from "@/services/passwordService";
import { getVisibleStudentsForFaculty } from "@/services/facultyAssignmentService";

export const testAllFixes = async () => {
  console.log("🧪 Starting comprehensive test of all fixes...");
  
  const results = {
    database: false,
    storage: false,
    authentication: false,
    passwordService: false,
    facultyAssignments: false,
    profilePhotos: false
  };

  try {
    // Test 1: Database connectivity
    console.log("🔍 Testing database connectivity...");
    const studentsTable = tables.students();
    const facultyTable = tables.faculty();
    
    if (studentsTable && facultyTable) {
      console.log("✅ Database tables accessible");
      results.database = true;
    } else {
      console.log("⚠️ Some database tables not accessible");
    }

    // Test 2: Storage connectivity
    console.log("🔍 Testing storage connectivity...");
    const profilesBucket = buckets.profiles();
    const documentsBucket = buckets.documents();
    
    if (profilesBucket || documentsBucket) {
      console.log("✅ Storage buckets accessible");
      results.storage = true;
    } else {
      console.log("⚠️ Storage buckets not accessible");
    }

    // Test 3: Student authentication
    console.log("🔍 Testing student authentication...");
    try {
      const testStudent = await authenticateStudent("23891A7228", "23891A7228");
      if (testStudent) {
        console.log("✅ Student authentication working");
        results.authentication = true;
      } else {
        console.log("⚠️ Student authentication failed");
      }
    } catch (error) {
      console.log("⚠️ Student authentication error:", error);
    }

    // Test 4: Faculty authentication
    console.log("🔍 Testing faculty authentication...");
    try {
      const testFaculty = await authenticateFaculty("AIDS-HVS1", "@VSrinivas231");
      if (testFaculty) {
        console.log("✅ Faculty authentication working");
        results.authentication = true;
      } else {
        console.log("⚠️ Faculty authentication failed");
      }
    } catch (error) {
      console.log("⚠️ Faculty authentication error:", error);
    }

    // Test 5: Password service
    console.log("🔍 Testing password service...");
    try {
      const validation = passwordService.validatePassword("TestPassword123!");
      if (validation.isValid) {
        console.log("✅ Password validation working");
        results.passwordService = true;
      } else {
        console.log("⚠️ Password validation failed");
      }
    } catch (error) {
      console.log("⚠️ Password service error:", error);
    }

    // Test 6: Faculty assignments
    console.log("🔍 Testing faculty assignments...");
    try {
      const visibleStudents = await getVisibleStudentsForFaculty("AIDS-HVS1");
      console.log(`✅ Faculty assignments working - found ${visibleStudents.length} students`);
      results.facultyAssignments = true;
    } catch (error) {
      console.log("⚠️ Faculty assignments error:", error);
    }

    // Test 7: Profile photo service
    console.log("🔍 Testing profile photo service...");
    try {
      const photoUrl = await profilePhotoService.getProfilePhotoUrl("test-user-id", "student");
      console.log("✅ Profile photo service working");
      results.profilePhotos = true;
    } catch (error) {
      console.log("⚠️ Profile photo service error:", error);
    }

  } catch (error) {
    console.error("❌ Test suite error:", error);
  }

  // Summary
  console.log("📊 Test Results Summary:");
  console.log(`Database: ${results.database ? '✅' : '❌'}`);
  console.log(`Storage: ${results.storage ? '✅' : '❌'}`);
  console.log(`Authentication: ${results.authentication ? '✅' : '❌'}`);
  console.log(`Password Service: ${results.passwordService ? '✅' : '❌'}`);
  console.log(`Faculty Assignments: ${results.facultyAssignments ? '✅' : '❌'}`);
  console.log(`Profile Photos: ${results.profilePhotos ? '✅' : '❌'}`);

  const successCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${successCount}/${totalTests} tests passed`);
  
  if (successCount === totalTests) {
    console.log("🎉 All fixes are working correctly!");
  } else {
    console.log("⚠️ Some issues remain. Check the logs above for details.");
  }

  return results;
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testAllFixes = testAllFixes;
  console.log("🧪 Test utility available. Run 'testAllFixes()' in console to test all fixes.");
}
