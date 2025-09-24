
function Container(props) {
    return (
        <div className={`max-w-6xl mx-auto px-4 ${props.classes}`}>
            {props.children}
        </div>
    )
}

export default Container
