export function createWssMessage(
  token: string,
  deviceUuid: string | null,
  action: string,
  data: any
) {
  let t = `Bearer ${token}`;
  return JSON.stringify({
    token: t,
    deviceUuid,
    action,
    data,
  });
}
