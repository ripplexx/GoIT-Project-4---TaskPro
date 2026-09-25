const Icon = ({ name, size = 16, className, style }) => (
    <svg
        width={size}
        height={size}
        className={className}
        style={style}
        aria-hidden="true"
        focusable="false"
    >
        <use href={`/sprite.svg#icon-${name}`} />
    </svg>
);

export default Icon;
