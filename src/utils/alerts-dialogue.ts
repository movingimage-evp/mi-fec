import Swal from "sweetalert2"

export const confirmationToDelete = () => (
    Swal.fire({
        title: 'Are you sure?',
        text: "Are you sure, you want to delete this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(result => result.isConfirmed)
);

export const successfullyCreated = () => (
    Swal.fire(
        'Success!',
        'Video has been successfully added',
        'success'
    ).then(result => result.isConfirmed)
);
