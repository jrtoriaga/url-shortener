import {render, screen } from "@testing-library/react"
import App from "../App"


test("renders homepage with url input", () => {
    render(<App />)
    const input = screen.getByRole('url-input')
    expect(input).toBeInTheDocument()
    expect(input).toBeEnabled()
})