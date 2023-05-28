import React from "react";
import Pagination from "react-bootstrap/Pagination";

export default function PaginationComponent({
  previous,
  next,
  currentPage,
  contacts,
  page,
  count
}) {
  const pageCount = Math.ceil(count / 5);

  const items = [];
  for (let i = 1; i <= pageCount; i++) {
    items.push(
      <Pagination.Item
        key={i}
        active={i === page}
        onClick={() =>
          currentPage({
            currentPage: i
          })
        }
      >
        {i}
      </Pagination.Item>
    );
  }
  return (
    <Pagination>
      <Pagination.Prev
        onClick={() => previous({ item: contacts[0] })}
        disabled={page === 1}
      />
      {items}
      <Pagination.Next
        disabled={page === pageCount}
        onClick={() => next({ item: contacts[contacts.length - 1] })}
      />
    </Pagination>
  );
}
