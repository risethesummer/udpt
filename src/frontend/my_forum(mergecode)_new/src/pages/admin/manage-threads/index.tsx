import {
  Table,
  Text,
  Button,
  Pagination,
  Drawer,
  TextInput,
  Textarea,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { requestGetAllThreads } from "../../../services/forum/get-all-thread";
import { requestDeleteThread } from "../../../services/forum/delete-thread";
import { requestUpdateThread } from "../../../services/forum/update-thread";
import { ThreadFields } from "../../../services/forum/forum.client";
import { Model } from "../../../services/client";
import { IconAt, IconTrash } from "@tabler/icons-react";

const ManageThreads = () => {
  const [threads, setThreads] = useState<Model<ThreadFields>[]>([]);
  const [approvedThreads, setApprovedThreads] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 3;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedThread, setSelectedThread] =
    useState<Model<ThreadFields> | null>(null);
  const handleTitleClick = (thread: Model<ThreadFields>) => {
    setSelectedThread(thread);
    setIsDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleUpdateThread = (updatedTitle: string, updatedContent: string) => {
    if (selectedThread) {
      const updatedData = {
        ...selectedThread.fields,
        title: updatedTitle,
        content: updatedContent,
      };

      const updatedThreads = threads.map((thread) =>
        thread.pk === selectedThread.pk
          ? { ...thread, fields: updatedData }
          : thread
      );

      requestUpdateThread(selectedThread.pk, updatedData)
        .then(() => {
          setThreads(updatedThreads);
          handleCloseDrawer();
        })
        .catch((error) => {
          console.error("Error updating thread:", error);
        });
    }
  };

  useEffect(() => {
    requestGetAllThreads()
      .then((threadsResponse) => {
        setThreads(threadsResponse.results);
      })
      .catch((error) => {
        console.error("Error fetching threads:", error);
      });
  }, []);
  useEffect(() => {
    const storedApprovedThreadsString = localStorage.getItem("approvedThreads");
    const storedApprovedThreads =
      storedApprovedThreadsString !== null
        ? JSON.parse(storedApprovedThreadsString)
        : {};
    setApprovedThreads(storedApprovedThreads);
  }, []);
  const handleDeleteThread = (pk: number) => {
    requestDeleteThread(pk)
      .then(() => {
        const updatedThreads = threads.filter((thread) => thread.pk !== pk);
        setThreads(updatedThreads);
      })
      .catch((error) => {
        console.error("Error deleting thread:", error);
      });
  };

  const handleEditStatus = (pk: number) => {
    const threadToUpdate = threads.find((thread) => thread.pk === pk);

    if (threadToUpdate) {
      const updatedData = {
        ...threadToUpdate.fields,
        approved: true,
      };

      requestUpdateThread(pk, updatedData)
        .then(() => {
          const updatedThreads = threads.map((thread) =>
            thread.pk === pk ? { ...thread, fields: updatedData } : thread
          );
          setThreads(updatedThreads);
          setApprovedThreads((prevApprovedThreads) => ({
            ...prevApprovedThreads,
            [pk]: true,
          }));
          localStorage.setItem(
            "approvedThreads",
            JSON.stringify({ ...approvedThreads, [pk]: true })
          );
        })
        .catch((error) => {
          console.error("Error updating thread:", error);
        });
    }
  };

  const columns = [
    { name: "pk", align: "center", title: "ID" },
    {
      name: "title",
      title: "Title of thread",
      render: (rowData: Model<ThreadFields>) => (
        <a
          href="#"
          className="text-blue-700"
          onClick={() => handleTitleClick(rowData)}
        >
          {rowData.fields.title}
        </a>
      ),
    },

    { name: "content", title: "Content of thread" },
    {
      name: "approved",
      title: "Status",
      align: "center",
      render: (rowData: Model<ThreadFields>) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            color={approvedThreads[rowData.pk] ? "green" : "red"}
            style={{ marginRight: "8px" }}
          >
            {approvedThreads[rowData.pk] ? "Approved" : "Not Approved"}
          </Text>
          <Button
            size="sm"
            variant="outline"
            color="blue"
            onClick={() => handleEditStatus(rowData.pk)}
            disabled={approvedThreads[rowData.pk]}
          >
            <IconAt /> Edit
          </Button>
        </div>
      ),
    },

    {
      title: "Delete",
      render: (rowData: Model<ThreadFields>) => (
        <Button
          size="sm"
          variant="outline"
          color="red"
          onClick={() => handleDeleteThread(rowData.pk)}
        >
          <IconTrash /> Delete
        </Button>
      ),
    },
  ];
  const totalThreads = threads.length;
  const totalPages = Math.ceil(totalThreads / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleThreads = threads.slice(startIndex, startIndex + pageSize);
  return (
    <>
      <Drawer
        opened={isDrawerOpen}
        onClose={handleCloseDrawer}
        title="Update Thread"
        position="left"
      >
        {selectedThread && (
          <div>
            <TextInput
              className=""
              type="text"
              placeholder="Your name"
              label="Title"
              description="*Title of thread "
              size="md"
              withAsterisk
              value={selectedThread.fields.title}
              onChange={(e) =>
                setSelectedThread((prev) => ({
                  ...prev,
                  fields: { ...prev.fields, title: e.target.value },
                }))
              }
            />
            <Textarea
              className="mt-[20px] "
              label="Content"
              description="*Content of thread "
              size="md"
              withAsterisk
              value={selectedThread.fields.content}
              onChange={(e) =>
                setSelectedThread((prev) => ({
                  ...prev,
                  fields: { ...prev.fields, content: e.target.value },
                }))
              }
            />
            <Button
              className="bg-blue-500 text-white border-blue-500 mt-[20px]"
              onClick={() =>
                handleUpdateThread(
                  selectedThread.fields.title,
                  selectedThread.fields.content
                )
              }
            >
              Update
            </Button>
          </div>
        )}
      </Drawer>

      <Table
        striped
        highlightOnHover
        withBorder
        withColumnBorders
        horizontalSpacing="xl"
        verticalSpacing="lg"
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.name}
                style={{
                  textAlign: "center",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                {column.title || column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleThreads.map((thread) => (
            <tr key={thread.pk}>
              {columns.map((column) => (
                <td
                  key={column.name}
                  className={`px-4 py-2 ${
                    column.name === "pk" ||
                    column.title === "Status" ||
                    column.title === "Delete"
                      ? "text-center"
                      : ""
                  }`}
                >
                  {(() => {
                    switch (column.name) {
                      case "title":
                        return (
                          <a
                            className="text-blue-500 cursor-pointer hover:text-red-500"
                            onClick={() => handleTitleClick(thread)}
                          >
                            {thread.fields[column.name]}
                          </a>
                        );
                      case "content":
                        return (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: thread.fields[column.name],
                            }}
                          />
                        );
                      case "approved":
                        return (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              color={
                                approvedThreads[thread.pk] ? "green" : "red"
                              }
                              style={{ marginRight: "8px" }}
                            >
                              {approvedThreads[thread.pk]
                                ? "Approved"
                                : "Not Approved"}
                            </Text>
                            <Button
                              size="sm"
                              variant="outline"
                              color="blue"
                              onClick={() => handleEditStatus(thread.pk)}
                              disabled={approvedThreads[thread.pk]}
                            >
                              <IconAt /> Edit
                            </Button>
                          </div>
                        );
                      case "pk":
                      default:
                        return column.render
                          ? column.render(thread)
                          : thread[column.name];
                    }
                  })()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        className="justify-center mt-[40px]"
        total={totalPages}
        value={currentPage}
        onChange={setCurrentPage}
      />
    </>
  );
};

export default ManageThreads;
