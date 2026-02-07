import { eventHandler, getMethod, setHeader, setResponseStatus } from "h3";

export default eventHandler((event) => {
	if (getMethod(event) !== "GET") {
		setResponseStatus(event, 405);
		setHeader(event, "Content-Type", "application/json");
		return { error: "Method Not Allowed" };
	}

	setResponseStatus(event, 200);
	setHeader(event, "Content-Type", "application/json");
	return { message: "Hello from the API" };
});
