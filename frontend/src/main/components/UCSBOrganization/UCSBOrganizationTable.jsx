import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { useNavigate } from "react-router";
import { hasRole } from "main/utils/useCurrentUser";
import { toast } from "react-toastify";


export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/ucsborganization",
        method: "DELETE",
        params: {
            orgCode: cell.row.original.orgCode
        }
    }
}

export function onDeleteSuccess(message) {
    console.log(message);
    toast(message);
}

export default function UCSBOrganizationTable({ organizations, currentUser }) {
    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ucsborganization/edit/${cell.row.original.orgCode}`); 
    };

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ucsborganization/all"]
    );
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            header: 'Organization Code',
            accessorKey: 'orgCode', 
        },
        {
            header: 'Short Translation',
            accessorKey: 'orgTranslationShort',
        },
        {
            header: 'Full Translation',
            accessorKey: 'orgTranslation',
        },
        {
            header: 'Inactive',
            id: 'inactive',
            accessorKey: 'inactive',
            cell: (info) => String(info.getValue())
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "UCSBOrganizationTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "UCSBOrganizationTable"));
    } 

    return <OurTable
        data={organizations}
        columns={columns}
        testid={"UCSBOrganizationTable"}
    />;
};