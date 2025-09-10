import React from 'react';

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  salary: number;
  yearsExperience: number;
  managerId: string | null;
  projectCode: string;
  performanceRating: number;
  location: string;
  joinDate: string;
}

const DataTable: React.FC = () => {
  const data: Employee[] = [
    { id: 1, employeeId: "E001", firstName: "Jean", lastName: "Uwimana", department: "IT", position: "Senior Developer", salary: 85000, yearsExperience: 8, managerId: "E010", projectCode: "PROJ_A", performanceRating: 4.2, location: "Kigali", joinDate: "2016-03-15" },
    { id: 2, employeeId: "E002", firstName: "Marie", lastName: "Mukamana", department: "Finance", position: "Analyst", salary: 45000, yearsExperience: 3, managerId: "E011", projectCode: "PROJ_B", performanceRating: 3.8, location: "Kigali", joinDate: "2021-07-20" },
    { id: 3, employeeId: "E003", firstName: "Paul", lastName: "Nkurunziza", department: "IT", position: "Junior Developer", salary: 35000, yearsExperience: 1, managerId: "E001", projectCode: "PROJ_A", performanceRating: 3.5, location: "Kigali", joinDate: "2023-01-10" },
    { id: 4, employeeId: "E004", firstName: "Grace", lastName: "Uwase", department: "HR", position: "Manager", salary: 75000, yearsExperience: 12, managerId: null, projectCode: "PROJ_C", performanceRating: 4.5, location: "Musanze", joinDate: "2012-09-05" },
    { id: 5, employeeId: "E005", firstName: "David", lastName: "Habimana", department: "Finance", position: "Senior Analyst", salary: 65000, yearsExperience: 6, managerId: "E011", projectCode: "PROJ_B", performanceRating: 4.1, location: "Kigali", joinDate: "2018-11-30" },
    { id: 6, employeeId: "E006", firstName: "Sarah", lastName: "Ingabire", department: "Marketing", position: "Coordinator", salary: 40000, yearsExperience: 2, managerId: "E012", projectCode: "PROJ_D", performanceRating: 3.9, location: "Huye", joinDate: "2022-05-18" },
    { id: 7, employeeId: "E007", firstName: "James", lastName: "Mugisha", department: "IT", position: "DevOps Engineer", salary: 70000, yearsExperience: 5, managerId: "E010", projectCode: "PROJ_A", performanceRating: 4.0, location: "Kigali", joinDate: "2019-08-12" },
    { id: 8, employeeId: "E008", firstName: "Alice", lastName: "Nyirahabimana", department: "Sales", position: "Representative", salary: 38000, yearsExperience: 4, managerId: "E013", projectCode: "PROJ_E", performanceRating: 3.6, location: "Rubavu", joinDate: "2020-02-28" }
  ];

  return (
    <div className="w-full overflow-hidden bg-white rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase">Emp ID</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase">Department</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase">Position</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase">Salary</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase">Exp</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase">Manager</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase">Project</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase">Rating</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase">Join Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((employee, index) => (
              <tr key={employee.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.employeeId}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.firstName} {employee.lastName}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.department}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.position}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">${employee.salary.toLocaleString()}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.yearsExperience}y</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.managerId || 'None'}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.projectCode}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.performanceRating}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.location}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">{employee.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-gray-50 border-t text-xs text-gray-600">
        <p><strong>Note:</strong> This dataset contains employee information including hierarchical relationships (Manager_ID), project assignments, performance metrics, and salary data. Some employees have NULL manager IDs indicating they are department heads.</p>
      </div>
    </div>
  );
};

export default DataTable;