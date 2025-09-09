import React from 'react';

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  district: string;
  occupation: string;
}

const DataTable: React.FC = () => {
  const data: Person[] = [
    { id: 1, firstName: "Jean Bosco", lastName: "Nkurunziza", district: "Gasabo", occupation: "Teacher" },
    { id: 2, firstName: "Aline", lastName: "Uwase", district: "Kicukiro", occupation: "Nurse" },
    { id: 3, firstName: "Eric", lastName: "Habimana", district: "Gasabo", occupation: "Software Dev" },
    { id: 4, firstName: "Diane", lastName: "Ingabire", district: "Rubavu", occupation: "Nurse" },
    { id: 5, firstName: "Patrick", lastName: "Mugisha", district: "Kicukiro", occupation: "" }
  ];

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">First Name</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Last Name</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">District</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Occupation</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((person, index) => (
              <tr key={person.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{person.id}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{person.firstName}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{person.lastName}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{person.district}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{person.occupation || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;