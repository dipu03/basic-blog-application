import Swal from "sweetalert2";

const Sweetalert = {
  success: async () => {
    return await Swal.fire({
      title: "Success",
      icon: "success",
      customClass: 'swal-wide',
    });
  },

  confirmation: async (message="Are you sure? ") => {
    return await Swal.fire({
      title: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      customClass: 'swal-wide',
    });
  },

  failed: async (message = "Something went wrong!") => {
    return await Swal.fire({
      icon: "error",
      title: "Oops...",
      customClass: 'swal-wide',
      text: message ? message : "Something went wrong!",
      // footer: "<a href>Why do I have this issue?</a>",
    });
  },
};

export default Sweetalert;
