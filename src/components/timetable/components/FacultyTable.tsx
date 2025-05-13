import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"; // Import shadcn table components

export default function FacultyTable({ data }: { data: IFacultyData[] }) {
  return (
    <div className=" p-4 max-w-2xl mx-auto">
      <div className=" border-2 bg-[#dceeef] border-black  rounded-lg shadow-sm overflow-hidden">
        <Table className="w-full">
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={item._id || index}
                className={`${
                  index === 0 ? "border-t-0" : "border-t border-2 border-gray-800"
                }`}
              >
                <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">
                  {item.faculty}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-600">
                  {item.facultySlot.join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
