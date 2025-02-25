const permissions = [
    {
      facility: "Department Facility",
      examples: ["Classrooms of CSE"],
      authorities: ["HOD of department"],
      emails: ["csehod@sggs.ac.in"]
    },
    {
      facility: "Ground Facilities",
      examples: ["Sports ground"],
      authorities: ["Sport faculty coordinator", "Organising faculty coordinator", "Dean of affairs"],
      emails: ["csehod@sggs.ac.in"]
    },
    {
      facility: "College Facilities",
      examples: ["Auditorium", "Conference hall"],
      authorities: ["Dean of affairs"],
      emails: ["csehod@sggs.ac.in"]
    },
    {
      facility: "Club Events",
      examples: ["Technical fests", "Cultural events"],
      authorities: ["General secretary", "Faculty coordinator of club"],
      emails: ["csehod@sggs.ac.in"]
    },
    {
      facility: "Leave Certificate",
      examples: ["Medical leave", "Personal leave"],
      authorities: ["Class coordinator", "HOD of department"],
      emails: ["csehod@sggs.ac.in"]
    }
  ];

  const applications = {
    LeaveApplication : ["67b6cc7e3f0313be8b23accd"/*class coordinator*/, "67b6cc1c3f0313be8b23acc9"/*HOD */],
    EventOrganisation : ["General Secretary", "67ba0d2a70096377beb26419"/*Dean of affairs */, "67ba214570096377beb26424"/*Director */],
    GirlsHostelPermission : ["Girls Representative", "67b6cc1c3f0313be8b23acc9"/*hod */, "67ba0d7270096377beb2641a"/*Girls hostel warden */],
    BoysHostelPermission : ["67b6cc1c3f0313be8b23acc9"/*HOD */,"Boys Hostel Warden"],
    GroundPermission : ["Sports Secretary", "67ba0d2a70096377beb26419"/*Dean of affairs */, "67ba214570096377beb26424"/*Director */],
  }