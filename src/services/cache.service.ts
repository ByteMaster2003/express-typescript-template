import cache from "persistent-cache";

const auth = cache({
  base: ".cache",
  persist: true,
  name: "authenticationCache"
});

const otp = cache({
  duration: 10 * 60 * 1000, // 10 minutes
  base: ".cache",
  persist: true,
  name: "otpCache"
});

export default { auth, otp };
