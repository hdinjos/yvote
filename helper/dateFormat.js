const dateFormat = (date) => {
  const newDate = new Date(date);

  let year = newDate.getFullYear();
  let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
  let day = ("0" + newDate.getDate()).slice(-2);
  let hour = newDate.getHours();
  let minute = newDate.getMinutes();
  let seconds = newDate.getSeconds();

  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds
  );
};

export default dateFormat;
