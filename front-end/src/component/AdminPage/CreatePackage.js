import React, { useEffect, useState } from "react";
import { GET_PACKAGES, DELETE_PACKAGE } from "../../Graphql";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Layout, theme, Card, Row, Col, Modal, message, Button } from "antd";
import CreatePackageButton from "./AdminComponent/CreatePackageButton";
import { CloseOutlined } from "@ant-design/icons";
import LoadingSpin from "../LoadingSpin";
import ErrorIcon from "../ErrorIcon";
const { Content } = Layout;
const { useToken } = theme;
const StrapiUrl = process.env.REACT_APP_API_URL;

export default function CreatePackage() {
  const { Meta } = Card;
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_PACKAGES);
  const [dataSource, setDataSource] = useState([]);
  const [deletePackage] = useMutation(DELETE_PACKAGE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = useToken();

  useEffect(() => {
    if (data && data.packages) {
      const mapData = data.packages.map((item) => ({
        documentId: item.documentId,
        Price: item.Price,
        Title: item.Title,
        Type: item.Type,
        urlImage: item.Image[0]?.url,
        Description: item.Description,
        MeetingPoint: item.MeetingPoint,
      }));
      setDataSource(mapData);
    }
  }, [data]);

  if (loading) return <LoadingSpin />;
  if (error) return <ErrorIcon />;

  const handleDelete = async () => {
    try {
      await deletePackage({
        variables: {
          documentId: selectedPackage.documentId,
        },
        context: {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        },
      });
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      message.error("Delete failed: " + error.message);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Sidebar />
      <Layout style={{ backgroundColor: "#FFF6ee" }}>
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Row gutter={[16, 16]} style={{ padding: "24px" }}>
              {dataSource.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.documentId}>
                  <Card
                    hoverable
                    style={{ width: "100%", height: "100%" }}
                    cover={
                      <>
                        <img
                          alt={item.Title}
                          src={`${StrapiUrl}${item.urlImage}`}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      </>
                    }
                    onClick={() => navigate("/admin/approve", { state: { ...item } })}
                  >
                    <Meta
                      title={item.Title}
                      description={
                        <>
                          <div>{item.Type}</div>
                          <div style={{ color: "#FF0000" }}>${item.Price}</div>
                        </>
                      }
                    />
                    <div>
                      <Button
                        style={{ marginLeft: "75%" }}
                        variant="solid "
                        color="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsModalOpen(true);
                          setSelectedPackage(item);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>

                  <Modal
                    title="Confirm Delete"
                    open={isModalOpen}
                    onOk={handleDelete}
                    onCancel={() => setIsModalOpen(false)}
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                  >
                    <p>คุณต้องการลบแพ็คเกจ "{selectedPackage?.Title}" ใช่หรือไม่</p>
                  </Modal>
                </Col>
              ))}
            </Row>
          </div>
          <div className="CreatePackageButton">
            <CreatePackageButton />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
